// One vehicle at a time, with time for each to leave the scene completely.
export function trafficAt(elapsed){
 const time=((elapsed+3)%35+35)%35;
 if(time<13)return {kind:'bus',time};
 if(time<24)return {kind:'taxi',time:time-13};
 return {kind:'car',time:time-24};
}
