import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import dayjs from "dayjs";

import  Subscription  from "../models/subscription.model.js";
import { sendReminderEmail } from "../utils/send.email.js";

const REMINDERS = [7, 5, 3, 1];

export const sendReminders = serve(async (context) => {
    
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== "Active") return;

    const renewalDate = dayjs(subscription.renewalDate);


    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal Date Reached For Subscription: ${subscriptionId}. Stopping Workflow...`);
        return;
    }

    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, "days");

        if(reminderDate.isAfter(dayjs())) {
            await sleepUntillReminder(context, `Reminder-${daysBefore} Days Before`, reminderDate);
        }

        await triggerReminder(context, `${daysBefore} Days Before Reminder`, subscription);

    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run("getSubscription", async () => {
        return Subscription.findById(subscriptionId).populate("user", "name email");
    });
};

const sleepUntillReminder = async (context, label, date) => {
    console.log(`Sleeping Untill ${label} Reminder At ${date}`);
    await context.sleepUntill(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} Reminder`);
        //Send Emails , SMS OR PUSH Notifications
        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription
        })
    })
}

