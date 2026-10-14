import Modal from "./Modal";
import Button from "./Button";
// Modal reutilizado pelos CRUDs para exigir confirmação antes de uma exclusão física.
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirmar",
  variant = "destructive",
  loading = false,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" disabled={loading} onClick={onClose}>
            Cancelar
          </Button>
          <Button variant={variant} disabled={loading} onClick={onConfirm}>
            {loading ? "Excluindo..." : confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
        {message}
      </p>
    </Modal>
  );
}
