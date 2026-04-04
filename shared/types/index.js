// User Roles
export var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["MANAGER"] = "MANAGER";
    UserRole["RESIDENT"] = "RESIDENT";
})(UserRole || (UserRole = {}));
// Financial Record
export var FinancialRecordType;
(function (FinancialRecordType) {
    FinancialRecordType["INVOICE"] = "invoice";
    FinancialRecordType["PAYMENT"] = "payment";
    FinancialRecordType["CREDIT"] = "credit";
    FinancialRecordType["CHARGE"] = "charge";
})(FinancialRecordType || (FinancialRecordType = {}));
// Maintenance Request
export var MaintenanceStatus;
(function (MaintenanceStatus) {
    MaintenanceStatus["PENDING"] = "pending";
    MaintenanceStatus["ASSIGNED"] = "assigned";
    MaintenanceStatus["IN_PROGRESS"] = "in_progress";
    MaintenanceStatus["COMPLETED"] = "completed";
    MaintenanceStatus["CANCELLED"] = "cancelled";
})(MaintenanceStatus || (MaintenanceStatus = {}));
export var MaintenancePriority;
(function (MaintenancePriority) {
    MaintenancePriority["LOW"] = "low";
    MaintenancePriority["MEDIUM"] = "medium";
    MaintenancePriority["HIGH"] = "high";
    MaintenancePriority["URGENT"] = "urgent";
})(MaintenancePriority || (MaintenancePriority = {}));
// Complaint
export var ComplaintStatus;
(function (ComplaintStatus) {
    ComplaintStatus["OPEN"] = "open";
    ComplaintStatus["ASSIGNED"] = "assigned";
    ComplaintStatus["IN_PROGRESS"] = "in_progress";
    ComplaintStatus["RESOLVED"] = "resolved";
    ComplaintStatus["CLOSED"] = "closed";
})(ComplaintStatus || (ComplaintStatus = {}));
//# sourceMappingURL=index.js.map