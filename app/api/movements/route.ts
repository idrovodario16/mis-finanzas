import {z} from 'zod';
import {getChatGPTUser} from '../../chatgpt-auth';
import {getDb} from '../../../db';
import {movements,goals} from '../../../db/schema';
import {eq,and} from 'drizzle-orm';
export async function GET(){ const u=await getChatGPTUser(); if(!u)return Response.json({error:'Inicia sesión'},{status:401}); return Response.json(await getDb().select().from(movements).where(eq(movements.userId,u.userId)),{headers:{'Cache-Control':'no-store'}}); }
export async function POST(req:Request){return save(req,false)}
export async function PUT(req:Request){return save(req,true)}
async function save(req:Request,edit:boolean){
 const u=await getChatGPTUser();if(!u)return Response.json({error:'Inicia sesión'},{status:401});
 if(!validOrigin(req))return Response.json({error:'Origen inválido'},{status:403});
 const schema=z.object({id:z.string().nullable().optional(),goalId:z.string().nullable().optional(),date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v=>!isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v),type:z.enum(['income','expense','saving']),concept:z.string().trim().min(1).max(120),category:z.string().trim().min(1).max(60),cents:z.number().int().positive().max(1000000000)});
 let raw;try{raw=await req.json()}catch{return Response.json({error:'Datos inválidos'},{status:400})}
 const parsed=schema.safeParse(raw);if(!parsed.success){const names:Record<string,string>={id:'Identificador',date:'Fecha: selecciona una fecha válida.',type:'Tipo: selecciona ingreso, gasto o ahorro.',concept:'Concepto: escribe una descripción de hasta 120 caracteres.',category:'Categoría: selecciona una opción.',cents:'Monto: ingresa un valor mayor a cero, con hasta dos decimales y máximo $10 millones.'};const messages=[...new Set(parsed.error.issues.map(issue=>names[String(issue.path[0])]||'Revisa los datos del movimiento.'))];return Response.json({error:messages.join(' ')},{status:400});}const b=parsed.data;
 if(edit&&!b.id)return Response.json({error:'Falta identificador'},{status:400});
 if(b.goalId){if(b.type!=='saving')return Response.json({error:'Solo los ahorros pueden vincularse a una meta.'},{status:400});const owned=await getDb().select().from(goals).where(and(eq(goals.id,b.goalId),eq(goals.userId,u.userId)));if(!owned.length)return Response.json({error:'Meta no encontrada'},{status:404});}
 const data={goalId:b.type==='saving'?(b.goalId||null):null,date:b.date,type:b.type,concept:b.concept.trim(),category:b.category.trim(),cents:b.cents};
 if(edit){const rows=await getDb().update(movements).set(data).where(and(eq(movements.id,b.id!),eq(movements.userId,u.userId))).returning();if(!rows.length)return Response.json({error:'Registro no encontrado'},{status:404});}
 else await getDb().insert(movements).values({...data,id:crypto.randomUUID(),userId:u.userId});
 return Response.json({ok:true});
}
export async function DELETE(req:Request){const u=await getChatGPTUser();if(!u)return Response.json({error:'Inicia sesión'},{status:401});if(!validOrigin(req))return Response.json({error:'Origen inválido'},{status:403});const id=new URL(req.url).searchParams.get('id');if(!id)return Response.json({error:'Falta identificador'},{status:400});await getDb().delete(movements).where(and(eq(movements.id,id),eq(movements.userId,u.userId)));return Response.json({ok:true});}

function validOrigin(req: Request) {
 const origin=req.headers.get('origin');
 return origin==='https://mis-finanzas-dario-idrovo.brownlyric131.chatgpt.site'||(process.env.NODE_ENV!=='production'&&origin===new URL(req.url).origin);
}
