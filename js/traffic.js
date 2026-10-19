// Each round starts with a bus, followed by its selected car.
export function trafficAt(elapsed,round=0){
 const time=((elapsed+3)%24+24)%24;
 if(time<13)return {kind:'bus',time};
 return {kind:round%2?'taxi':'car',time:time-13};
}
