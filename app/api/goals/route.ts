import {z} from 'zod';
import {getChatGPTUser} from '../../chatgpt-auth';
import {getDb} from '../../../db';
import {goals} from '../../../db/schema';
import {eq,and} from 'drizzle-orm';
export async function GET(){const u=await getChatGPTUser();if(!u)return Response.json({error:'Inicia sesión'},{status:401});return Response.json(await getDb().select().from(goals).where(eq(goals.userId,u.userId)),{headers:{'Cache-Control':'no-store'}})}
export async function POST(req:Request){return save(req,false)}
export async function PUT(req:Request){return save(req,true)}
async function save(req:Request,edit:boolean){
 const u=await getChatGPTUser();if(!u)return Response.json({error:'Inicia sesión'},{status:401});
 const origin=req.headers.get('origin');if(origin!=='https://mis-finanzas-dario-idrovo.brownlyric131.chatgpt.site'&&!(process.env.NODE_ENV!=='production'&&origin===new URL(req.url).origin))return Response.json({error:'Origen inválido'},{status:403});
 let raw;try{raw=await req.json()}catch{return Response.json({error:'Datos inválidos'},{status:400})}
 const p=z.object({id:z.string().optional(),name:z.string().trim().min(1).max(80),targetCents:z.number().int().positive().max(1000000000),monthlyCents:z.number().int().positive().max(1000000000)}).safeParse(raw);
 if(!p.success)return Response.json({error:'Escribe un nombre y montos positivos con hasta dos decimales (máximo $10 millones).'},{status:400});
 const {id,...data}=p.data;
 if(edit){if(!id)return Response.json({error:'Falta identificador'},{status:400});const found=await getDb().update(goals).set(data).where(and(eq(goals.id,id),eq(goals.userId,u.userId))).returning();if(!found.length)return Response.json({error:'Meta no encontrada'},{status:404})}
 else await getDb().insert(goals).values({...data,id:crypto.randomUUID(),userId:u.userId});
 return Response.json({ok:true});
}
