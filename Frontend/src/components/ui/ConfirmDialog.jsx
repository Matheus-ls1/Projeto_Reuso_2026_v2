import Modal from "./Modal";
import Button from "./Button";
export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "Confirmar", variant = "destructive" }) {
    return (<Modal open={open} onClose={onClose} title={title} size="sm" footer={<>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant={variant} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
        </>}>
      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{message}</p>
    </Modal>);
}
