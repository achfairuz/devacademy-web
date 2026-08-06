const SUBSCRIPTION_KEY = 'devacademy.subscription_plan'

export function getSubscriptionPlan(): string {
  return localStorage.getItem(SUBSCRIPTION_KEY) ?? 'premium'
}

export function setSubscriptionPlan(planId: string) {
  localStorage.setItem(SUBSCRIPTION_KEY, planId)
}
