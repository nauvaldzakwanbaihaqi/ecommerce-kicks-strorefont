"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function AuthPolicy() {
    return (
        <div className="w-full space-y-6 ">
            <div className="flex items-start space-x-3 group">
                <Checkbox
                    id="terms"
                    className="mt-1 w-6 h-6 border-2 border-black data-[state=checked]:bg-black data-[state=checked]:text-white shrink-0"
                />
                <div className="grid gap-1.5 leading-none">
                    <Label
                        htmlFor="terms"
                        className="text-[13px] font-black uppercase leading-tight cursor-pointer"
                    >
                        By clicking &apos;Log In&apos; you agree to our website{" "}
                        <span className="underline decoration-2 underline-offset-2">KicksClub Terms &amp; Conditions</span>,{" "}
                        <span className="underline decoration-2 underline-offset-2">Kicks Privacy Notice</span> and{" "}
                        <span className="underline decoration-2 underline-offset-2">Terms &amp; Conditions</span>.
                    </Label>
                </div>
            </div>

            <div className="flex items-start space-x-3 group">
                <Checkbox
                    id="keep-logged-in"
                    className="mt-1 w-6 h-6 border-2 border-black data-[state=checked]:bg-black data-[state=checked]:text-white shrink-0"
                />
                <div className="grid gap-1.5 leading-none">
                    <Label
                        htmlFor="keep-logged-in"
                        className="text-[13px] font-black uppercase leading-tight cursor-pointer"
                    >
                        Keep me logged in - applies to all log in options below.{" "}
                        <span className="underline decoration-2 underline-offset-2">More info</span>
                    </Label>
                </div>
            </div>
        </div>
    );
}
