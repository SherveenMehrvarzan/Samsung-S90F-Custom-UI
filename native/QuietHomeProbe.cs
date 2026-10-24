using System;
using System.IO;
using System.Text;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Runtime.InteropServices;
using System.Text.Json;
using System.Collections.Generic;
using System.Threading;

internal static class QuietHomeProbe {
 [DllImport("libbundle.so.0")] static extern IntPtr bundle_create();
 [DllImport("libbundle.so.0")] static extern void bundle_free(IntPtr b);
 [DllImport("libaul.so.0")] static extern int aul_svc_set_operation(IntPtr b,string op);
 [DllImport("libaul.so.0")] static extern int aul_get_default_app(IntPtr b,out IntPtr app);
 [DllImport("libvconf.so.0")] static extern IntPtr vconf_get_str(string k);
 [DllImport("libvconf.so.0")] static extern int vconf_get_int(string k,out int v);
 [DllImport("libapp-context-manager-common.so")] static extern byte util_is_appbooting_supported_webapp_byappid(string id);
 [DllImport("libc")] static extern uint getuid();
 [DllImport("libc")] static extern void free(IntPtr p);
 static string ReadString(string k) {
  var p=vconf_get_str(k);if(p==IntPtr.Zero)throw new Exception("Cannot read "+k);
  try{return Marshal.PtrToStringAnsi(p);}finally{free(p);}
 }
 static object Query() {
  if(IntPtr.Size!=4||getuid()!=901)throw new Exception("Expected ARM32 SDK UID 901");
  string home;var b=bundle_create();if(b==IntPtr.Zero)throw new Exception("bundle_create failed");
  try{
   if(aul_svc_set_operation(b,"http://tizen.org/appcontrol/operation/main")!=0)throw new Exception("Main operation query failed");
   IntPtr p;if(aul_get_default_app(b,out p)!=0||p==IntPtr.Zero)throw new Exception("Default Home query failed");
   try{home=Marshal.PtrToStringAnsi(p);}finally{free(p);}
  }finally{bundle_free(b);}
  var strings=new Dictionary<string,string>();
  foreach(var key in new[]{"db/appfw/home_appid","db/appfw/startup_appid","db/appfw/booting_appid_backup","db/first_screen/type"})strings.Add(key,ReadString(key));
  int autostart;if(vconf_get_int("db/menu/smart_hub/ontvsetting/auto_start",out autostart)!=0)throw new Exception("Autostart query failed");
  return new {Home=home,Strings=strings,Autostart=autostart,Target="QuietHome1.Launcher",BootSupported=util_is_appbooting_supported_webapp_byappid("QuietHome1.Launcher"),Uid=getuid(),Bits=IntPtr.Size*8,Firmware=File.ReadAllText("/etc/prd_info.ini"),Runtime=Environment.Version.ToString()};
 }
 public static int Main(string[] args) {
  if(args.Length!=1||args[0].Length!=32)return 2;
  string result;try{result=JsonSerializer.Serialize(new{ok=true,snapshot=Query()});}catch(Exception e){result=JsonSerializer.Serialize(new{ok=false,error=e.ToString()});}
  var listener=new TcpListener(IPAddress.Loopback,4796);listener.Start();
  try{
   using var cancel=new CancellationTokenSource(TimeSpan.FromSeconds(30));
   using var client=listener.AcceptTcpClientAsync(cancel.Token).AsTask().GetAwaiter().GetResult();
   client.ReceiveTimeout=5000;client.SendTimeout=5000;
   using var stream=client.GetStream();var request=new byte[4096];int n=stream.Read(request,0,request.Length);
   if(!Encoding.ASCII.GetString(request,0,n).StartsWith("GET /"+args[0]+" HTTP/1."))return 3;
   byte[] body=Encoding.UTF8.GetBytes(result);
   byte[] headers=Encoding.ASCII.GetBytes("HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: "+body.Length+"\r\nConnection: close\r\n\r\n");
   stream.Write(headers,0,headers.Length);stream.Write(body,0,body.Length);return 0;
  }finally{listener.Stop();}
 }
}
