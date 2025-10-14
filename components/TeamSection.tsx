"use client";
import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  image: string;
  bio: string;
  expertise: string[];
  linkedin?: string;
  email?: string;
}

interface TeamSectionProps {
  title: string;
  subtitle: string;
  members: TeamMember[];
  badgeText?: string;
  className?: string;
}

export function TeamSection({
  title,
  subtitle,
  members,
  badgeText = "Meet the Team",
  className = "",
}: TeamSectionProps) {
  return (
    <section
      className={`relative bg-gradient-to-b from-gray-50 to-white py-20 dark:from-neutral-900 dark:to-neutral-950 sm:py-28 ${className}`}
    >
      <Container>
        <div className="text-center">
          <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-500/10 to-brand-500/10 px-4 py-2 text-sm font-medium text-purple-600 ring-1 ring-inset ring-purple-500/20 dark:text-purple-400">
            {badgeText}
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
            {subtitle}
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <div
              key={member.id}
              className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:shadow-brand-500/10 dark:bg-neutral-800"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="relative">
                {/* Profile Section */}
                <div className="text-center">
                  {member.image && (
                    <div className="relative mx-auto mb-6 w-fit">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500/20 to-purple-500/20 blur-md" />
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={120}
                        height={120}
                        className="relative rounded-full ring-4 ring-white shadow-lg dark:ring-neutral-700"
                      />
                      {/* Status indicator */}
                      <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-green-500 ring-2 ring-white dark:ring-neutral-800">
                        <div className="flex h-full w-full items-center justify-center">
                          <svg
                            className="h-3 w-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            role="presentation"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="mt-2 text-brand-500 font-medium">
                    {member.title}
                  </p>
                </div>

                {/* Bio */}
                <blockquote className="mt-6 text-center text-gray-600 dark:text-gray-300 italic">
                  "{member.bio}"
                </blockquote>

                {/* Expertise Tags */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {member.expertise.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="rounded-full bg-gradient-to-r from-brand-500/10 to-purple-500/10 px-3 py-1 text-xs font-medium text-brand-600 ring-1 ring-inset ring-brand-500/20 dark:text-brand-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Social Links */}
                <div className="mt-8 flex justify-center gap-4">
                  {member.linkedin && (
                    <Link
                      href={member.linkedin}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-blue-500 hover:text-white hover:shadow-lg dark:bg-neutral-700 dark:text-gray-400 dark:hover:bg-blue-500"
                      aria-label={`${member.name} LinkedIn profile`}
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        role="presentation"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  )}
                  {member.email && (
                    <Link
                      href={`mailto:${member.email}`}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-brand-500 hover:text-white hover:shadow-lg dark:bg-neutral-700 dark:text-gray-400 dark:hover:bg-brand-500"
                      aria-label={`Email ${member.name}`}
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        role="presentation"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
