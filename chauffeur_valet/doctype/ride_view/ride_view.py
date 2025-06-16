import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime

class RideView(Document):
    def before_insert(self):
        self.viewed_at = now_datetime()
        if not self.status:
            self.status = "Viewed"

    def validate(self):
        # Check if this user has already viewed this ride
        existing_view = frappe.get_all(
            "Ride View",
            filters={
                "ride": self.ride,
                "viewed_by": self.viewed_by
            },
            limit=1
        )
        if existing_view:
            frappe.throw("You have already viewed this ride") 