"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();

  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Mystery_message
        </a>
        {session ? (
          <span className="mr-8">
            {user.username || user.email}
            <Button onClick={() => signOut()} className="w-full md:w-auto">
              Logout
            </Button>
          </span>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto">Log In</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
