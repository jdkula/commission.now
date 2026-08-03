import { env } from '$env/dynamic/private';
import { MongoClient } from 'mongodb';

const uri = (env.MONGO_URI ?? "mongodb://example").replace('%u', env.MONGO_USER ?? "unknown").replace('%p', env.MONGO_PASS ?? "unknown");

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
