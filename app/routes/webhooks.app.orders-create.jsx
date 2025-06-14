import { authenticate } from "../shopify.server";
import jwt from 'jsonwebtoken';
import axios from 'axios';

export const action = async ({ request }) => {
    try{
        const { shop, topic, payload } = await authenticate.webhook(request);
        const body = '';
        var data = {
            "SHOP_NAME": shop,
            "PAYLOAD": payload
        }
        var expiresIn = '1h'
        data = JSON.stringify(data)
        jwt.sign({ data }, process.env.SECRET_KEY, { expiresIn }, async (error, token) => {
            if (error) {
                console.log(error);
            }
            else {
                const response = axios.post('', body, {
                    headers: {
                        "token": token,
                        'Content-Type': "application/json"
                    }
                })
            }
        });
    }catch(error){
        console.log("Webhook Create Order Error", error);
    } 
};