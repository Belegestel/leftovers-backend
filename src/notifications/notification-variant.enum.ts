import { NotificationType } from "../generated/prisma/enums";

export enum NotificationVariant {
  RECIPE_CHANGE = "RECIPE_CHANGE",
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
