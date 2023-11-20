import IotApi from '@arduino/arduino-iot-client';
import rp from 'request-promise';
import dotenv from 'dotenv';

dotenv.config();

const getToken = async () => {
    const options = {
        method: 'POST',
        url: 'https://api2.arduino.cc/iot/v1/clients/token',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        json: true,
        form: {
            grant_type: 'client_credentials',
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            audience: 'https://api2.arduino.cc/iot'
        }
    };

    try {
        const response = await rp(options);
        return response['access_token'];
    }
    catch (error) {
        console.error("Failed getting an access token: " + error)
    }
}

const run = async () => {
    const client = IotApi.ApiClient.instance;
    // Configure OAuth2 access token for authorization: oauth2
    const oauth2 = client.authentications['oauth2'];
    oauth2.accessToken = await getToken();
    
    const api = new IotApi.DevicesV2Api(client)    
    api.devicesV2List().then(devices => {
        console.log(devices);
    }, error => {
        console.log(error)
    });
}

// run();

const listProperties = async () => {
    const client = IotApi.ApiClient.instance;
    // Configure OAuth2 access token for authorization: oauth2
    const oauth2 = client.authentications['oauth2'];
    oauth2.accessToken = await getToken();

    const api = new IotApi.PropertiesV2Api(client)
    const id = process.env.DEVICE_ID; // {String} The id of the thing

    const opts = {
      'showDeleted': false // {Boolean} If true, shows the soft deleted properties
    };

    api.propertiesV2List(id, opts).then(data => {
        for (const obj of data) {
            console.log(`VARIABLE: ${obj.variable_name}, VALUE: ${obj.last_value} \n`);
        }; 
    }, error => {
        console.log(error)
    });
}

listProperties();