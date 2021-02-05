import { BadRequestException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { isURL } from "class-validator";

export const isValidUrl = str => isURL(str, {
  protocols: ["https", "http"],
  require_tld: true,
  require_protocol: true,
});
export const isUrlArray = arr=>{
  if(Array.isArray(arr) === false) throw new Error("parameter must be an array");
  const validationResult = arr.map(item=> isValidUrl(item)).filter(result=> result === false);
  if(validationResult.length>0) throw new RpcException(new BadRequestException("invalid Url/s"));
  return true;
}