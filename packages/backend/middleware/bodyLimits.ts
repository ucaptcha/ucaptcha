import { bodyLimit } from "hono/body-limit";

export const bodyLimitForPing = bodyLimit({
	maxSize: 14000,
	onError: (c) => {
		return c.json({
			message: "Request body too large. It should be under 14kB.",
		}, 413);
	}
});
