"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface AboutContactFormProps {
  title: string
  description: string
  nameLabel: string
  emailLabel: string
  messageLabel: string
  submitLabel: string
}

export function AboutContactForm({
  title,
  description,
  nameLabel,
  emailLabel,
  messageLabel,
  submitLabel,
}: AboutContactFormProps) {
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
  }

  return (
    <Card className="p-5 sm:p-6 bg-card/70 border-border">
      <h2 className="text-base sm:text-sm font-semibold text-foreground mb-1">
        {title}
      </h2>
      <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed">
        {description}
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label
            htmlFor="about-name"
            className="text-sm font-medium text-foreground"
          >
            {nameLabel}
          </label>
          <Input
            id="about-name"
            name="name"
            autoComplete="name"
            className="bg-background/60"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="about-email"
            className="text-sm font-medium text-foreground"
          >
            {emailLabel}
          </label>
          <Input
            id="about-email"
            name="email"
            type="email"
            autoComplete="email"
            className="bg-background/60"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="about-message"
            className="text-sm font-medium text-foreground"
          >
            {messageLabel}
          </label>
          <Textarea
            id="about-message"
            name="message"
            rows={5}
            className="bg-background/60 resize-none"
          />
        </div>

        <div className="pt-1">
          <Button type="submit" className="w-full sm:w-auto">
            {submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  )
}

