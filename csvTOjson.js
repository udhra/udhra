const fs = require("fs");
const readLine = require("readline");
var entireData = [];
var headers = [];
var sugarIndex=0 , saltIndex = 0 , countryIndex = 0 ,fatIndex = 0, proteinsIndex = 0 , carboIndex = 0 ,dateIndex = 0;
var count = 0 ;
var countryArray = ['Netherlands', 'Canada', 'United Kingdom' , 'United States' , 'Australia' , 'France' , 'Germany' , 'Spain', 'South Africa'];
var NorthEurope = ['United Kingdom' , 'Denmark' , 'Sweden' , 'Norway'];
var CentralEurope = ['France' , 'Belgium' , 'Germany' , ' Switzerland' , 'Netherlands'];
var SouthEurope = ['Portugal', 'Greece' , 'Italy' , 'Spain' , 'Croatia' , 'Albania'];
var region = ['NorthEurope' , 'CentralEurope' , 'SouthEurope'];
var SaltSugar = [] , FPCData2 = [];


const data = readLine.createInterface({
  input: fs.createReadStream("FoodFacts.csv")
});


data.on("line", (line) =>{

entireData=line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

if(count==0){
  sugarIndex=entireData.indexOf('sugars_100g');
  saltIndex=entireData.indexOf('salt_100g');
  countryIndex=entireData.indexOf('countries_en');
  fatIndex=entireData.indexOf('fat_100g');
  proteinsIndex=entireData.indexOf('proteins_100g');
  carboIndex=entireData.indexOf('carbohydrates_100g');
  dateIndex =entireData.indexOf('last_modified_datetime');
  count++;
  console.log(countryIndex);
 console.log(sugarIndex);
  console.log(saltIndex);
/*  console.log(fatIndex);
  console.log(proteinIndex);
  console.log(carboIndex);
  console.log(dateIndex);*/
}
else{

  if(countryArray.indexOf(entireData[countryIndex])!==-1){
    var sugar = entireData[sugarIndex];
    var salt = entireData[saltIndex];
      if(sugar==''){
        sugar = 0;
    }
    if(salt==''){
        salt = 0;
    }
    var caution = 0;
  for(var i=0;i<SaltSugar.length;i++){
    if(SaltSugar[i]["country"]===entireData[countryIndex]){
      SaltSugar[i]["salt"] = ((parseFloat(SaltSugar[i]["salt"]) + parseFloat(salt)).toFixed(2));
      SaltSugar[i]["sugar"] = ((parseFloat(SaltSugar[i]["sugar"]) + parseFloat(sugar)).toFixed(2));
      caution++;
      break;
    }
  }
  if(caution===0){
    SaltSugar.push({
      "country" : entireData[countryIndex],
      "sugar" : parseFloat(sugar).toFixed(2),
      "salt" : parseFloat(salt).toFixed(2)
    });
  }
}

if((NorthEurope.indexOf(entireData[countryIndex])!==-1) || (CentralEurope.indexOf(entireData[countryIndex])!==-1)
 || (SouthEurope.indexOf(entireData[countryIndex])!==-1)){
  var fat =entireData[fatIndex];
  var proteins = entireData[proteinsIndex];
  var carbo = entireData[carboIndex];
  var countryName = entireData[countryIndex];
  var temp;
  var caution = 0;
  if(fat == '')
    fat =0;
  if(proteins == '')
    proteins = 0;
  if(carbo == '')
    carbo = 0;



    if((NorthEurope.indexOf(entireData[countryIndex])!==-1)) {
       temp = "NorthEurope";//['NorthEurope' , 'CentralEurope' , 'SouthEurope'];
     }

     if((CentralEurope.indexOf(entireData[countryIndex])!==-1)) {
        temp = "CentralEurope";//['NorthEurope' , 'CentralEurope' , 'SouthEurope'];
      }

      if((SouthEurope.indexOf(entireData[countryIndex])!==-1)) {
         temp = "SouthEurope";//['NorthEurope' , 'CentralEurope' , 'SouthEurope'];
       }

       FPCData(countryName,fat,proteins,carbo,temp);
}

function FPCData(country,fat,proteins,carbo, temp){

// console.log(FPCData2[region.indexOf(temp)]);
  if(FPCData2[region.indexOf(temp)]==null)
  {
    FPCData2[region.indexOf(temp)] = {
      "region": temp,
      "fat" : parseFloat(fat).toFixed(2),
      "proteins" : parseFloat(proteins).toFixed(2),
      "carbohydrates": parseFloat(carbo).toFixed(2)
    };
  }
  else
  {
    FPCData2[region.indexOf(temp)].fat=(parseFloat(FPCData2[region.indexOf(temp)].fat)+parseFloat(fat)).toFixed(2);
    FPCData2[region.indexOf(temp)].proteins=(parseFloat(FPCData2[region.indexOf(temp)].proteins)+parseFloat(proteins)).toFixed(2);
    FPCData2[region.indexOf(temp)].carbohydrates=(parseFloat(FPCData2[region.indexOf(temp)].carbohydrates)+parseFloat(carbo)).toFixed(2);
  }
}

}//else End
});//data.on End



data.on("close" , () =>{
  console.log("End Function");
  fs.writeFile('JsonFiles/saltsugar.json', JSON.stringify(SaltSugar) , 'utf-8');
  fs.writeFile('JsonFiles/FPC.json', JSON.stringify(FPCData2) , 'utf-8');
  //console.log("Literate and Illiterate Male and Female JSON created");
  console.log(SaltSugar);
  console.log(JSON.stringify(FPCData2));
});
