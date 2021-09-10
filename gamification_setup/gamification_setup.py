"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources
from web_fragments.fragment import Fragment
from xblock.core import XBlock
from xblock.fields import Integer, Scope
from xblockutils.studio_editable import StudioEditableXBlockMixin
from django.contrib.auth.models import User
from xmodule.modulestore.django import modulestore
from xmodule.tabs import CourseTab

class GamificationSetupXBlock(StudioEditableXBlockMixin, XBlock):
    """
    TO-DO: document what your XBlock does.
    """

    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.

    # TO-DO: delete count, and define your own fields.
    count = Integer(
        default=0, scope=Scope.user_state,
        help="A simple counter, to show something happening",
    )

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
        The primary view of the GamificationSetupXBlock, shown to students
        when viewing courses.
        """
        html = self.resource_string("static/html/gamification_setup.html")
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("static/css/gamification_setup.css"))
        frag.add_javascript(self.resource_string("static/js/src/gamification_setup.js"))
        frag.initialize_js('GamificationSetupXBlock')
        return frag

    # TO-DO: change this handler to perform your own actions.  You may need more
    # than one handler, or you may not need any handlers at all.
    @XBlock.json_handler
    def init_gamification(self, data, suffix=''):
        """
        An example handler, which increments the data.
        """
        # Just to show data coming in...
        user_id = self.xmodule_runtime.user_id
        uname = User.objects.get(id = user_id).username

        #Course tabsp
        store = modulestore()
        #with store.bulk_operations(course_id):
        course_id = self.scope_ids.usage_id.course_key
        course = store.get_course(course_id)
        tab_id = "None"
        for tab in course.tabs:
            try:
                tab_name = tab.get('name')
            except:
                pass
            try:
                if str(tab_name) == "Dashboard":
                    try:
                        tab_id = str(tab.get('tab_id'))[11:]
                        break
                    except:
                        pass
            except:
                pass

        return {
            "username": uname, 
            "course_id" : str(course_id),
            "tab_id" : tab_id
            }

    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("GamificationSetupXBlock",
             """<gamification_setup/>
             """),
            ("Multiple GamificationSetupXBlock",
             """<vertical_demo>
                <gamification_setup/>
                <gamification_setup/>
                <gamification_setup/>
                </vertical_demo>
             """),
        ]
