export type Toast = {
  message: string
  variant?: 'danger'
  action?: {
    icon: string
    onClick: () => void
  }
};
