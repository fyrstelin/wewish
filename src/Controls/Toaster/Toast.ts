export type Toast = {
    message: string
    variant?: 'danger'
    action?: {
        icon: { ios: string, md: string}
        onClick: () => void
    }
};