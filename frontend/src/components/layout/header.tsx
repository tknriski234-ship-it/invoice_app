"use client";

import Link from "next/link";
import Button from "../ui/button";

export default function HomeHeader(){
    return(
        <header className="w-full flex items-center justify-between px-6 py-4 border-b mx-auto">
            <Link href="/">Invoice App</Link>

            <div className="flex items-center gap-2 mx-2 px-0">
                <Link href="/account/login">
                    <Button variant="primary" className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition">Login</Button>
                </Link>
                <Link href="/account/register" >
                    <Button variant="primary" className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition">register</Button>
                </Link>
            </div>
            
        </header>
    )
}
