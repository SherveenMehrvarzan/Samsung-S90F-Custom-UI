using System;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Threading;

internal static class QuietHomeControl {
 const string Target="QuietHome1.Launcher", Operation="http://tizen.org/appcontrol/operation/main", AutoKey="db/menu/smart_hub/ontvsetting/auto_start", Firmware="T-RSMFAKUC-0090-1301.0";
 static readonly string[] Keys={"db/appfw/home_appid","db/appfw/startup_appid","db/appfw/booting_appid_backup","db/first_screen/type"};
 [DllImport("libc")] static extern uint getuid();
 [DllImport("libc")] static extern void free(IntPtr p);
 [DllImport("libbundle.so.0")] static extern IntPtr bundle_create();
 [DllImport("libbundle.so.0")] static extern void bundle_free(IntPtr b);
 [DllImport("libaul.so.0")] static extern int aul_svc_set_operation(IntPtr b,string operation);
 [DllImport("libaul.so.0")] static extern int aul_get_default_app(IntPtr b,out IntPtr app);
 [DllImport("libcapi-appfw-app-operation-tv.so.0")] static extern int app_operation_set_current_app(string operation,string app);
 [DllImport("libvconf.so.0")] static extern IntPtr vconf_get_str(string key);
 [DllImport("libvconf.so.0")] static extern int vconf_get_int(string key,out int value);
 [DllImport("libvconf.so.0")] static extern int vconf_set_str(string key,string value);
 [DllImport("libvconf.so.0")] static extern int vconf_set_int(string key,int value);
 [DllImport("libapp-context-manager-common.so")] static extern byte util_is_appbooting_supported_webapp_byappid(string id);
 public sealed class Snapshot {
  public string Home{get;set;} public Dictionary<string,string> Strings{get;set;} public int Autostart{get;set;}
  public string Firmware{get;set;} public string Target{get;set;} public byte BootSupported{get;set;} public uint Uid{get;set;} public int Bits{get;set;} public string Runtime{get;set;}
 }
 static void Guard(){if(IntPtr.Size!=4||getuid()!=901)throw new Exception("Expected 32-bit SDK UID 901");if(!File.ReadAllText("/etc/prd_info.ini").Contains(Firmware))throw new Exception("Exact firmware guard failed");}
 static string ReadString(string key){var p=vconf_get_str(key);if(p==IntPtr.Zero)throw new Exception("Missing native string: "+key);try{return Marshal.PtrToStringAnsi(p);}finally{free(p);}}
 static string ReadHome(){var b=bundle_create();if(b==IntPtr.Zero)throw new Exception("Cannot create query bundle");try{if(aul_svc_set_operation(b,Operation)!=0)throw new Exception("Cannot set query operation");IntPtr p;if(aul_get_default_app(b,out p)!=0||p==IntPtr.Zero)throw new Exception("Cannot query main app");try{return Marshal.PtrToStringAnsi(p);}finally{free(p);}}finally{bundle_free(b);}}
 static Snapshot Query(){Guard();int auto;if(vconf_get_int(AutoKey,out auto)!=0)throw new Exception("Cannot query autostart");return new Snapshot{Home=ReadHome(),Strings=Keys.ToDictionary(k=>k,k=>ReadString(k)),Autostart=auto,Firmware=File.ReadAllText("/etc/prd_info.ini"),Target=Target,BootSupported=util_is_appbooting_supported_webapp_byappid(Target),Uid=getuid(),Bits=IntPtr.Size*8,Runtime=Environment.Version.ToString()};}
 static Snapshot Load(string path){var original=JsonSerializer.Deserialize<Snapshot>(File.ReadAllText(path));if(original==null||string.IsNullOrWhiteSpace(original.Home)||original.Strings==null||original.Strings.Count!=Keys.Length||Keys.Any(k=>!original.Strings.ContainsKey(k)||string.IsNullOrWhiteSpace(original.Strings[k]))||original.Firmware!=File.ReadAllText("/etc/prd_info.ini")||original.Target!=Target||original.Uid!=901||original.Bits!=32||(original.Autostart!=0&&original.Autostart!=1))throw new Exception("Incomplete or incompatible baseline");return original;}
 static bool Same(Snapshot a,Snapshot b){return a.Home==b.Home&&a.Autostart==b.Autostart&&Keys.All(k=>a.Strings[k]==b.Strings[k]);}
 static void SetHome(string app){int status=app_operation_set_current_app(Operation,app);if(status!=0||ReadHome()!=app)throw new Exception("Main-operation write/readback failed: "+status);}
 static void SetString(string key,string value){int status=vconf_set_str(key,value);if(status!=0||ReadString(key)!=value)throw new Exception("String write/readback failed: "+key+" status="+status);}
 static void RequireRestorable(Snapshot now,Snapshot original){if(now.Home!=original.Home&&now.Home!=Target)throw new Exception("Unknown Home assignment; restore refused");if(now.Autostart!=original.Autostart)throw new Exception("Autostart drift; restore refused");foreach(var k in Keys)if(now.Strings[k]!=original.Strings[k]&&now.Strings[k]!=Target)throw new Exception("Unrelated preference drift: "+k);}
 static Snapshot Restore(Snapshot original){RequireRestorable(Query(),original);SetHome(original.Home);foreach(var key in Keys)SetString(key,original.Strings[key]);int status=vconf_set_int(AutoKey,original.Autostart);if(status!=0)throw new Exception("Autostart restore write failed: "+status);Thread.Sleep(350);var after=Query();if(!Same(after,original))throw new Exception("Restore readback mismatch");return after;}
 public static int Main(string[] args){
  try{
   Guard();if(args.Length==1&&args[0]=="query"){Console.WriteLine("QH_QUERY="+JsonSerializer.Serialize(Query()));return 0;}
   if(args.Length!=2||!(args[0]=="verify"||args[0]=="restore"||args[0]=="apply"||args[0]=="startup"))throw new Exception("Use query, or verify|restore|apply|startup BASELINE");
   var original=Load(args[1]);var before=Query();
   if(args[0]=="verify"){if(!Same(before,original))throw new Exception("Baseline drift");Console.WriteLine("QH_VERIFIED="+JsonSerializer.Serialize(before));return 0;}
   if(args[0]=="restore"){Console.WriteLine("QH_RESTORED="+JsonSerializer.Serialize(Restore(original)));return 0;}
   if(args[0]=="startup"){
    RequireRestorable(before,original);
    if(before.Home!=Target||before.Strings[Keys[0]]!=Target||before.BootSupported!=1)throw new Exception("Startup requires the verified custom Home assignment and boot eligibility");
    try{
     // These two target values were observed as this firmware's automatic
     // derived values when home_appid was assigned. Autostart was already 1.
     SetString("db/appfw/startup_appid",Target);SetString("db/appfw/booting_appid_backup",Target);
     int status=vconf_set_int(AutoKey,1);if(status!=0)throw new Exception("Autostart write failed: "+status);
     Thread.Sleep(350);var started=Query();
     if(started.Home!=Target||started.Strings[Keys[0]]!=Target||started.Strings[Keys[1]]!=Target||started.Strings[Keys[2]]!=Target||started.Strings[Keys[3]]!=before.Strings[Keys[3]]||started.Autostart!=1)throw new Exception("Startup readback mismatch");
     Console.WriteLine("QH_STARTUP="+JsonSerializer.Serialize(started));return 0;
    }catch(Exception startupError){
     try{Restore(before);Console.WriteLine("QH_ROLLED_BACK="+JsonSerializer.Serialize(Query()));}
     catch(Exception rollbackError){Console.WriteLine("QH_URGENT_RESTORE_FAILED="+rollbackError);return 4;}
     throw new Exception("Startup failed; preceding Home-only state restored",startupError);
    }
   }
   if(!Same(before,original))throw new Exception("Apply requires exact original state");if(before.BootSupported!=1)throw new Exception("Target is not boot-eligible");
   try{
    SetHome(Target);SetString("db/appfw/home_appid",Target);Thread.Sleep(350);var after=Query();
    // This firmware derives startup_appid and booting_appid_backup from a Home
    // change. Preserve the saved startup values for this Home-only operation.
    foreach(var key in Keys.Skip(1)){
     if(after.Strings[key]!=original.Strings[key]){
      if(after.Strings[key]!=Target)throw new Exception("Unrelated derived preference change: "+key);
      SetString(key,original.Strings[key]);
     }
    }
    Thread.Sleep(350);after=Query();Console.WriteLine("QH_AFTER="+JsonSerializer.Serialize(after));
    if(after.Home!=Target||after.Strings[Keys[0]]!=Target||after.Autostart!=original.Autostart||Keys.Skip(1).Any(k=>after.Strings[k]!=original.Strings[k]))throw new Exception("Apply readback or startup preservation failed");
    Console.WriteLine("QH_APPLIED="+JsonSerializer.Serialize(after));return 0;
   }catch(Exception applyError){
    try{var now=Query();if(!Same(now,original))Restore(original);Console.WriteLine("QH_ROLLED_BACK="+JsonSerializer.Serialize(Query()));}
    catch(Exception rollbackError){Console.WriteLine("QH_URGENT_RESTORE_FAILED="+rollbackError);return 4;}
    throw new Exception("Apply failed; original state verified/restored",applyError);
   }
  }catch(Exception e){Console.WriteLine("QH_ERROR="+e);return 1;}
 }
}
