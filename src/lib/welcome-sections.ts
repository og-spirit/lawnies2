export interface FormField {
  label: string;
  placeholder: string;
}

export interface FormSection {
  title: string;
  fields: FormField[];
}

export const DEFAULT_FORM_SECTIONS: FormSection[] = [
  {
    title: "Services & Pricing",
    fields: [
      {
        label: "Services you offer",
        placeholder: "Example: Lawn mowing, edging, weed control, green waste removal",
      },
      {
        label: "How you normally price jobs",
        placeholder:
          "Example: Minimum callout $120. Standard mow from $150 up to 400sqm. Add $40 for overgrown lawns.",
      },
    ],
  },
  {
    title: "Where & When You Work",
    fields: [
      {
        label: "Service areas / suburbs",
        placeholder: "Example: Perth, Fremantle, Joondalup, Midland, Rockingham",
      },
      {
        label: "Working hours",
        placeholder: "Example: Mon-Fri 7am-5pm, Sat 8am-12pm, Sun closed.",
      },
    ],
  },
  {
    title: "Booking Rules",
    fields: [
      {
        label: "Booking limits or rules",
        placeholder: "Example: Minimum 24 hr lead time.",
      },
      {
        label: "Details we should collect from callers",
        placeholder:
          "Example: Full name, address, mobile, service needed, preferred day/time, access details.",
      },
    ],
  },
  {
    title: "Escalations",
    fields: [
      {
        label: "When should we alert you immediately?",
        placeholder:
          "Example: Urgent cleanups or complaints should be SMSed to me immediately on 0400 123 456.",
      },
    ],
  },
];
