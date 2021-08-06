import UserAPI from "./UserAPI"
import tokenDecoder from "../utils/tokenDecoder"
import * as DBHelper from "../../models/dbHelper"
import config from "../../config/config"


export async function postUser(event) {
  let dbHelper = new DBHelper.DbHelper();
  await dbHelper.connect(config.development);
  dbHelper.init();
  await dbHelper.migrate();

  
  
  const accessToken = event.headers.Authorization;
  const userId = tokenDecoder.decode(accessToken)[1].identities[0]["userId"];

  
  
  try {
    await UserAPI.createUser(dbHelper,userId);
    await dbHelper.disconnect();
    return {
      statusCode: 200,
      body: "success"
    };
  }
  catch (e) {
    await dbHelper.disconnect();
    return {
      statusCode: 400,
      body: "PostUser Error : " + e.stack
      
    };
  }
  
}

export async function addMemoToProject(event) {
  let dbHelper = new DBHelper.DbHelper();
  await dbHelper.connect(config.development);
  dbHelper.init();
  await dbHelper.migrate();
  
  let projectInformation;
  try{
    projectInformation = JSON.parse(event.body);
  }
  catch(e){
    return {
      statusCode: 400,
      body: "request body(projectInformation) is not valid :" +e.stack
    };
  }
  
  const accessToken = event.headers.Authorization;
  const userId = tokenDecoder.decode(accessToken)[1].identities[0]["userId"];
  
  try {
    await ProjectAPI.addMemoToProject(dbHelper,userId,project.projectId,projectInformation.memoIdList);
    await dbHelper.disconnect();
    return {
      statusCode: 200,
      body: "success"
    };
  }
  catch (e) {
    await dbHelper.disconnect();
    return {
      statusCode: 400,
      body: "postProject Error : " + e.stack
      
    };
  }
  
}
