import frappe
from frappe import _

@frappe.whitelist()
def mark_ride_as_viewed(ride_id):
    try:
        # Use ERPNext's view log system
        view_log = frappe.new_doc("View Log")
        view_log.update({
            "reference_doctype": "Ride",
            "reference_name": ride_id,
            "viewed_by": frappe.session.user,
            "viewed_on": frappe.utils.now(),
        })
        
        view_log.insert(ignore_permissions=True)

        return {"success": True, "message": "Ride marked as viewed."}
    except Exception as e:
        return {"success": False, "message": str(e)}

@frappe.whitelist()
def accept_ride(ride_id):
    try:
        ride = frappe.get_doc("Ride", ride_id)
        if ride.status not in ["Pending", "Viewed"]:
            return {"success": False, "message": "Only pending or viewed rides can be accepted."}
        ride.status = "Accepted"

        # Set driver info from User DocType
        driver_user = frappe.session.user
        driver_doc = frappe.get_doc("User", driver_user)
        driver_name = getattr(driver_doc, "full_name", None) or getattr(driver_doc, "first_name", None) or driver_user
        driver_phone = getattr(driver_doc, "phone", None) or getattr(driver_doc, "mobile_no", None)
        ride.driver = driver_user
        ride.driver_name = driver_name
        ride.driver_phone = driver_phone

        # Set supplier info for the current driver
        try:
            suppliers = frappe.get_all(
                "Supplier",
                filters={"custom_user": driver_user},
                fields=["name"],
                limit=1
            )
            if suppliers:
                ride.supplier = suppliers[0].name
        except Exception as e:
            frappe.log_error(f"Error setting supplier for ride {ride_id}: {str(e)}")

        ride.save()
        return {"success": True, "message": "Ride accepted."}
    except Exception as e:
        frappe.log_error(f"Error accepting ride: {str(e)}")
        return {"success": False, "message": str(e)}

@frappe.whitelist()
def ignore_ride(ride_id):
    try:
        ride = frappe.get_doc("Ride", ride_id)
        if ride.status not in ["Pending", "Viewed"]:
            return {"success": False, "message": "Only pending or viewed rides can be ignored."}
        ride.status = "Ignored"
        ride.save()
        return {"success": True, "message": "Ride ignored."}
    except Exception as e:
        frappe.log_error(f"Error ignoring ride: {str(e)}")
        return {"success": False, "message": str(e)}

@frappe.whitelist()
def update_ride_status(ride_id, new_status):
    try:
        ride = frappe.get_doc("Ride", ride_id)
        valid_statuses = ["On the Way", "Reached", "In Progress", "Completed"]
        if new_status not in valid_statuses:
            return {"success": False, "message": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}
        
        # Validate status transitions
        status_flow = {
            "Accepted": ["On the Way"],
            "On the Way": ["Reached"],
            "Reached": ["In Progress"],
            "In Progress": ["Completed"]
        }
        
        if ride.status not in status_flow or new_status not in status_flow[ride.status]:
            return {"success": False, "message": f"Cannot transition from {ride.status} to {new_status}"}
        
        ride.status = new_status
        ride.save()
        return {"success": True, "message": f"Ride status updated to {new_status}."}
    except Exception as e:
        frappe.log_error(f"Error updating ride status: {str(e)}")
        return {"success": False, "message": str(e)}

@frappe.whitelist()
def start_trip(ride_id, otp):
    try:
        ride = frappe.get_doc("Ride", ride_id)
        if ride.status != "Reached":
            return {"success": False, "message": "Can only start trip when status is 'Reached'."}
            
        # OTP validation logic
        if not hasattr(ride, 'otp') or not ride.otp:
            return {"success": False, "message": "No OTP set for this ride."}
        if str(ride.otp) != str(otp):
            return {"success": False, "message": "Invalid OTP. Please try again."}
            
        ride.status = "In Progress"
        ride.save()
        return {"success": True, "message": "Trip started."}
    except Exception as e:
        frappe.log_error(f"Error starting trip: {str(e)}")
        return {"success": False, "message": str(e)}

@frappe.whitelist()
def get_service_area():
    """Get the service area for the current user from Supplier DocType"""
    try:
        user = frappe.session.user
        
        # Get supplier linked to current user
        custom_serviceable_city, custom_serviceable_zone = frappe.get_value(
            "Supplier",
            {"custom_user": user},
            ["custom_serviceable_city", "custom_serviceable_zone"]
        )
        
        if not custom_serviceable_city or not custom_serviceable_zone:
            return {"success": False, "message": "No supplier found for this user."}
        
        return {
            "success": True,
            "data": {
                "city": custom_serviceable_city,
                "zone": custom_serviceable_zone
            }
        }
    except Exception as e:
        return {"success": False, "message": str(e)}

@frappe.whitelist()
def update_service_area(cities=None, zones=None):
    """Update the service area for the current user in Supplier DocType"""
    try:
        user = frappe.session.user
        
        # Convert string inputs to lists if they're not None
        if isinstance(cities, str):
            cities = frappe.parse_json(cities)
        if isinstance(zones, str):
            zones = frappe.parse_json(zones)
            
        # Get supplier linked to current user
        supplier = frappe.get_all(
            "Supplier",
            filters={"custom_user": user},
            fields=["name"]
        )
        
        if not supplier:
            return {"success": False, "message": "No supplier found for this user."}
            
        supplier = frappe.get_doc("Supplier", supplier[0].name)
        
        # Update the custom fields
        supplier.custom_serviceable_city = frappe.as_json(cities) if cities else None
        supplier.custom_serviceable_zone = frappe.as_json(zones) if zones else None
        
        supplier.save()
        return {"success": True, "message": "Service area updated successfully."}
    except Exception as e:
        frappe.log_error(f"Error updating service area: {str(e)}")
        return {"success": False, "message": str(e)} 