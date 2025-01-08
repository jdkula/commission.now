import { MONGO_PASS, MONGO_URI, MONGO_USER } from '$env/static/private';
import { MongoClient } from 'mongodb';

const uri = MONGO_URI.replace('%u', MONGO_USER).replace('%p', MONGO_PASS);

export const mongo = new MongoClient(uri);
const dbraw = mongo.db('commission_now');

export const db = {
	redirects: dbraw.collection<Redirect>('redirects')
};

export interface Redirect {
	_id: string;
	to: string; 
	user_id: string;
	enabled: boolean;
}
