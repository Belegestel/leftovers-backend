import { NotificationType } from "../generated/prisma/enums";

export enum NotificationVariant {
  RECIPE_EDIT = "RECIPE_EDIT",
}

export function NotifVariantFromPrisma(
  prisma: NotificationType,
): NotificationVariant {
  return NotificationVariant[prisma];
}

export function NotifVariantToPrisma(
  variant: NotificationVariant,
): NotificationType {
  return NotificationType[variant];
}
