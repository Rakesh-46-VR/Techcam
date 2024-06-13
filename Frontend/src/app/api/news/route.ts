export async function GET() {
    const data = await res.json()
   
    return Response.json({ data })
  }