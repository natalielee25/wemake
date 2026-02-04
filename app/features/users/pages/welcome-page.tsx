import { Resend } from "resend";

const client = new Resend(process.env.RESEND_API_KEY);

export const loader = async () => {
    const { data, error } = await client.emails.send({
        from: "Nat <nat@internall.co>",
        to: "nanatalie1551@gmail.com",
        subject: "Testing Resend",
        html: "<h1>Hey Nat from Internall !</h1>"
    });
    return Response.json({ data, error });
};