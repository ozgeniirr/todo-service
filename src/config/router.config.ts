import { AuthRoute } from "@/api/routes/Auth.routes";
import { OtpRoute } from "@/api/routes/Otp.routes";
import { Routes } from "@/interfaces/routes.interface";

export const startRouterConfig: Routes[] = [
    AuthRoute.triggerUser(),
    OtpRoute.triggerUser()

]