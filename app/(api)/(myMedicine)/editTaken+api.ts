import { neon } from "@neondatabase/serverless";

export async function PUT(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    const body = await request.json();
    const {
      id,
      name,
      description,
      start_date,
      end_date,
      time,
      dates_times,
      user_id,
    } = body;
    console.log("body.id", body.id);
    console.log("body.name", body.name);
    console.log("body.description", body.description);
    console.log("body.start_date", body.start_date);
    console.log("body.end_date", body.end_date);
    console.log("body.time", body.time);
    console.log("body.dates_times", body.dates_times);
    console.log("body.user_id", body.user_id);
    // Ensure all required fields are present
    // if (!id || !name || !description || !day || !time || user_id) {
    //   return new Response(
    //     JSON.stringify({ error: "Missing required fields" }),
    //     {
    //       status: 400,
    //     }
    //   );
    // }

    //   const response111 = `
    //   UPDATE my_medicine
    //   SET name = ${name}, description = ${description},start_date = ${start_date},end_date=${end_date},time = ${JSON.stringify(time)},dates_times = ${JSON.stringify(dates_times)}
    //   WHERE id = ${id} AND user_id = ${user_id}
    //   RETURNING *;
    // `;
    //   console.log("response111", response111);
    //   // Update the medicine for the logged-in user

    const response = await sql`
      UPDATE my_medicine
      SET "name" = ${name}, "description" = ${description},start_date = ${start_date},end_date=${end_date},"time" = ${JSON.stringify(time)},"dates_times" = ${JSON.stringify(dates_times)}
      WHERE "id" = ${id} AND "user_id" = ${user_id}
      RETURNING *;
    `;

    if (response.length === 0) {
      return new Response(JSON.stringify({ error: "Medicine not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ data: response }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating medicine:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }, // Ensure the content type is always JSON
    });
  }
}
