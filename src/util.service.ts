import { Injectable } from "@nestjs/common";
import { APIFeaturesDto, APIFeaturesSingleDto } from "./dto/APIFeaturesDto";

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
            features.take = query.limit;
            features.skip = query.limit*query.page;
        }
        return features;
    }
}