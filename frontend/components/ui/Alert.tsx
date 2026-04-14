type AlertProps = {
    type : "error" | "success";
    message : string;
};

export default function Alert ({type,message}: AlertProps) {
    const base = "rounded-lg px-4 py-3 text-sm border";

    const styles = 
    type === "error"
    ? "border-red-200 bg-red-50 text-red-600"
    : "border-emerald-200 bg-emerald-50 text-emerald-700";

    return (
        <p className={`${base} ${styles}`}>{message}</p>
    )
}