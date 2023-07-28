import { Injectable } from "@nestjs/common";
import { APIFeaturesDto, APIFeaturesSingleDto } from "../dto/APIFeaturesDto";
import {randomBytes,pbkdf2Sync} from 'crypto'

@Injectable()
export class UtilService{
    apiFeaturesSingle(query:APIFeaturesSingleDto){
        const select:any = {}
        if(query.select ){
            query.select.forEach((selectItem)=>{select[selectItem]=true});
        }
        return {select};
    }
    apiFeatures(query:APIFeaturesDto){
        let features:{select?:any,take?:number,skip?:number} = {select:{}}
        if(query.select ){
          query.select.forEach((selectItem)=>{features.select[selectItem]=true});
        }
        if(query.limit&&query.page){
            features.take = 1*query.limit;
            features.skip = 1*query.limit*query.page;
        }
        return features;
    }
    hash(password:string):{hash:string,salt:string}{
        const salt = randomBytes(16).toString('hex');
        const hash = pbkdf2Sync(
          password,
          salt,
          1000,
          64,
          `sha512`
        ).toString(`hex`);
        return {salt,hash}
      }
      check(password:string,hash:string,salt:string):boolean{
        const checkHash = pbkdf2Sync(
            password,
            salt,
            1000,
            64,
            `sha512`
          ).toString(`hex`);
          return checkHash===hash;
      }
}