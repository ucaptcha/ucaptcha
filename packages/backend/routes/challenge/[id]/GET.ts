import { Context } from "hono";
import { errorResponse } from "@/lib/common";
import { getChallengeByID } from "@/lib/challenge";

export const getChallenge = async (c: Context<null, "/challenge/:id", null>) => {
    const id = c.req.param("id");
    const challenge = await getChallengeByID(id);
    if (!challenge) {
        return errorResponse(c, "Challenge not found.", 404);
    }
    return c.json({
        id: challenge.id,
        g: challenge.g,
        T: challenge.T,
        N: challenge.N,
        resource: challenge.resource,
        siteKey: challenge.siteKey,
        status: challenge.status
    });
};
