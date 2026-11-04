"use client";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { publicHttp } from "@/lib/public-http";
import styles from "./message-form.module.css";

export function MessageForm() {
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<{ error: boolean; text: string } | null>(
    null,
  );
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const fields = Object.fromEntries(
      ["name", "email", "subject", "message", "website"].map((key) => [
        key,
        String(data.get(key) ?? "").trim(),
      ]),
    );
    if (!fields.name || fields.message.length < 10) {
      setStatus({
        error: true,
        text: "Please enter your name and a message of at least 10 characters.",
      });
      return;
    }
    const controller = new AbortController();
    request.current = controller;
    setPending(true);
    setStatus(null);
    try {
      const response = await publicHttp.post("/messages", fields, {
        signal: controller.signal,
        timeout: 20000,
      });
      if (
        response.data?.success !== true ||
        response.data?.data?.received !== true
      )
        throw new Error("Unconfirmed delivery");
      form.reset();
      setStatus({
        error: false,
        text: "Thank you! Your message has been received. I’ll get back to you by email.",
      });
    } catch (error) {
      if (controller.signal.aborted) return;
      setStatus({
        error: true,
        text:
          axios.isAxiosError(error) && error.response?.status === 429
            ? "Too many attempts. Please wait a little before sending again."
            : "Couldn’t confirm delivery. Your message is still here—please try again later or use the email link above.",
      });
    } finally {
      request.current = null;
      if (!controller.signal.aborted) setPending(false);
    }
  }
  return (
    <form
      className={styles.form}
      onSubmit={submit}
      aria-label="Send Yograj a message"
    >
      <h3>Leave a message</h3>
      <p>Have a project, question, or opportunity? Write to me here.</p>
      <fieldset disabled={pending}>
        <div className={styles.row}>
          <label>
            Your name
            <input name="name" autoComplete="name" required maxLength={100} />
          </label>
          <label>
            Email address
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
            />
          </label>
        </div>
        <label>
          Subject <span>(optional)</span>
          <input name="subject" maxLength={200} />
        </label>
        <label>
          Message
          <textarea
            name="message"
            required
            minLength={10}
            maxLength={5000}
            rows={5}
          />
        </label>
        <div className={styles.trap} aria-hidden="true">
          <label>
            Leave this empty
            <input
              name="website"
              tabIndex={-1}
              autoComplete="off"
              maxLength={200}
            />
          </label>
        </div>
        <button type="submit">{pending ? "Sending…" : "Send message ↗"}</button>
      </fieldset>
      {status && (
        <p
          role={status.error ? "alert" : "status"}
          className={status.error ? styles.error : styles.success}
        >
          {status.text}
        </p>
      )}
    </form>
  );
}
