module ApplicationHelper
    def active_link_class(controller, action)
        "font-weight-bold underline" if controller_name == controller && action_name == action
      end
end
