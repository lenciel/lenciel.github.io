"""Script to generate a WordPress eXtended RSS (WXR) file from a x2blog backup file
"""

# 2008 Lenciel <lenciel@gmail.com>.

#import psycopg2
import re
import sys
import xml.dom.minidom
from lxml import etree

from datetime import datetime
from optparse import OptionParser

class Export(object):
    """Handles the details of creating a WordPress eXtended RSS (WXR)."""

    def __init__(self, input):
        """Creates the basic document."""
        self.input_tree = input
        self.site = ''

        self.xml = xml.dom.minidom.Document()
        self.rss = self._create_element('rss', self.xml)
        self.rss.setAttribute('xmlns:content',
                              'http://purl.org/rss/1.0/modules/content/')
        self.rss.setAttribute('xmlns:wfw',
                              'http://wellformedweb.org/CommentAPI/')
        self.rss.setAttribute('xmlns:dc', 'http://purl.org/dc/elements/1.1/')
        self.rss.setAttribute('xmlns:wp', 'http://wordpress.org/export/1.0/')
        self.channel = self._create_element('channel', self.rss)

    def _create_element(self, name, parent=None, value=None):
        """Helper function for creating XML elements.

        Parameters:
        :param name: The name of the element
        :type name: ``str``
        :param parent: (Optional) The XML node you want this element to be a
        child of.
        :type b: ``Node``

        :return: The element
        :rtype: ``Node``.
        """
        element = self.xml.createElement(str(name))

        if parent:
            parent.appendChild(element)

        if value:
            element_value = self.xml.createTextNode(str(value))
            element.appendChild(element_value)

        return element

    def display(self):
        """Returns the formatted XML document."""
        return self.xml.toprettyxml('')

    def create_site_info(self, title, url, description):
        """Populates the site information."""
        self._create_element('title', self.channel, title)
        self.site = url
        self._create_element('link', self.channel, url)
        self._create_element('description', self.channel, description)
        self._create_element('pubDate', self.channel, datetime.utcnow())
        self._create_element('generator', self.channel, 'x2wp.py')
        self._create_element('language', self.channel, 'cn')

    def create_category(self, nicename, name=""):
        """Creates a Category."""
        if name != "":
            category = self._create_element('wp:category', self.channel)
            self._create_element('wp:category_nicename', category, nicename)
            self._create_element('wp:category_parent', category)
            element = self._create_element('wp:cat_name', category)
            self._cdata(name, element)


    def create_item(self, data):
        """Creates an item from the Item element in the tree."""
        linkpath = datetime.strptime(data[1].text,"%Y-%m-%d %H:%M:%S").strftime('%Y/%m/%d')
        link = "%s/%s/%s" % (self.site, linkpath, data[0].text.encode("utf-8"))
        item = self._create_element('item', self.channel)
        self._create_element('title', item, data[0].text.encode("utf-8"))
        self._create_element('link', item, link)
        self._create_element('pubDate', item,
                            datetime.strptime(data[1].text,"%Y-%m-%d %H:%M:%S").strftime('%a, %d %b %Y %H:%M%S +0000'))
        self._create_element('dc:creator', item, 'admin')
        self.item_categories(item, data[2].text.encode("utf-8"))
        #no tag info, just left there
        #self.item_tags(item, xxx)
        guid = self._create_element('guid', item, link)
        guid.setAttribute('isPermaLink', 'true')
        self._create_element('description', item)
        element = self._create_element('content:encoded', item)
        self._cdata(data[4].text.encode("utf-8"), element)
        #self._create_element('wp:post_id', item, data[0])
        self._create_element('wp:post_date', item, data[1].text)
        self._create_element('wp:post_date_gmt', item, data[1].text)
        comments = 'open'
        self._create_element('wp:comment_status', item, comments)
        self._create_element('wp:ping_status', item, 'open')
        self._create_element('wp:post_name', item, data[0].text.encode("utf-8"))
        self._create_element('wp:status', item, 'publish')
        self._create_element('wp:post_parent', item, '0')
        self._create_element('wp:menu_item', item, '0')
        self._create_element('wp:post_type', item, 'post')
        self.item_comments(item, data[7])

    def item_categories(self, item, cata):
        """Links an item to categories."""
        element = self._create_element('category', item)
        self._cdata(cata, element)

    def create_tag(self, name):
        """Creates a Tag."""

    def item_tags(self, item, item_id):
        """Links an item to tags."""

    def item_comments(self, item, comment_elems):
        """Creates comments for an item."""
        for elem in comment_elems:
            comment = self._create_element('wp:comment', item)
            #self._create_element('wp:comment_id', comment, elem[0])
            element = self._create_element('wp:comment_author', comment)
            self._cdata(elem[1].text.encode("utf-8"), element)
            self._create_element('wp:comment_author_email', comment, 'x@y.com')
            self._create_element('wp:comment_author_url', comment, 'http://xxx')
            self._create_element('wp:comment_author_IP', comment, elem[2].text.encode("utf-8"))
            self._create_element('wp:comment_date', comment, elem[3].text.encode("utf-8"))
            self._create_element('wp:comment_date_gmt', comment, elem[3].text.encode("utf-8"))
            self._create_element('wp:comment_content', comment, elem[0].text.encode("utf-8"))
            self._create_element('wp:comment_approved', comment, '1')
            self._create_element('wp:comment_type', comment)
            self._create_element('wp:comment_parent', comment, '0')

    def _cdata(self, data, parent):
        """Helper function for creating CDATA sections."""
        cdata = self.xml.createCDATASection(data)
        parent.appendChild(cdata)

    def finalise(self):
        """Final cleanup."""
        wxr = self.display()
        return re.sub('>\n<!', '><!', wxr)

class Exporter(object):
    """Handles the wrap process."""

    def __init__(self, options):
        self.output_file = options.output
        self.input_tree = self._get_input()
        self.wxr = Export(self.input_tree)

    def _get_input(self):
        """get a etree from file."""
        try:
            parser = etree.XMLParser(ns_clean=True)
            input_tree = etree.parse(options.input ,parser)

        except(lxml.etree.XMLSyntaxError):
            sys.exit("I am unable to parse the file you supplied. Sorry.")

        return input_tree


    def _process_input_tree(self):
        """Creates the basic document. No tags because there are not in the x2blog backup file.
        """
        self.wxr.create_site_info("the site info", options.url, "description")

        for child in self.input_tree.getroot():
            #self.wxr.create_tag()
            self.wxr.create_category(child[2].text.encode("utf-8"),child[2].text.encode("utf-8"))
            self.wxr.create_item(child)

    def export(self):
        """Generates the WXR."""
        self._process_input_tree()
        output = self.wxr.finalise()

        if self.output_file:
            out = open(self.output_file,'w')
            out.write(output)
            out.close()
        else:
            print output


def parseoptions(args):
    """Parses command line options."""
    parser = OptionParser()
    parser.add_option("-i", "--input", type="string",
                      help="The filename to be process.")
    parser.add_option("-o", "--output", type="string",
                      help="The filename where you want the output stored.")
    parser.add_option("-u", "--url", default="http://lenciel.com",type="string",
                  help="The url you use for your new wordpress blog.")
    return parser.parse_args(args)[0]

if __name__ == '__main__':
    options = parseoptions(sys.argv)
    exporter = Exporter(options)
    exporter.export()
