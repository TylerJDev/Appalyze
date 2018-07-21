import urllib.request
from bs4 import BeautifulSoup
import html5lib
from random import randint
from calendar import monthrange

# This script is used to create a demo dialogue text using conversations from a wikia page #

mainDialogues = [];
textlog = [];
links = ['http://metalgear.wikia.com/wiki/Metal_Gear_Solid_2_radio_conversations', 'http://metalgear.wikia.com/wiki/Metal_Gear_Solid_4_radio_conversations']

def get_main_page(link):
    user_agent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7'
    headers = {'User-Agent': user_agent}

    page = link;
    # Return the pages HTML to this var
    urlibPage = urllib.request.urlopen(page);

    # parse the html using beautiful soup and store in variable `soup`
    soup = BeautifulSoup(urlibPage, "html5lib");

    # The element grab items from a wiki page i.e, (http://metalgear.wikia.com/wiki/Metal_Gear_Solid_4_radio_conversations)
    mainDiv = 'WikiaMainContent';
    mainContent = soup.find(id=mainDiv);
    # Find <p> elements within mainContent, as they contain the content
    dialogueContent = mainContent.findAll('p')

    # For this specific script, I only want dialogue for either characters[0] or characters[1]...
    characters = ['Snake:', 'Otacon:'];

    for m_text in dialogueContent:
        try:
            if (m_text.find('b').text in characters):
                mainDialogues.append([m_text.find('b').text[:-1], m_text.text[len(m_text.find('b').text) + 1:]])
        except Exception as e:
            continue;

    return True;

# To grab data from multiple links...
for grabLinks in links:
    get_main_page(grabLinks);

def getData():
    # The start date of which to process from
    startDate = {'startDateMonth': 9, 'startDateDay': 4, 'startDateYear': 2011, 'startTime': 1}
    # as above, so below
    AMPM = 'PM'

    for textArr in mainDialogues:
        if startDate['startTime'] == 13:
            startDate['startTime'] = 1;

        if startDate['startTime'] == 12:
            if AMPM == 'PM':
                startDate['startDateDay'] += 1;
                AMPM = 'AM';
            elif AMPM == 'AM':
                AMPM = 'PM'
                # if the current day )startDateDay is LESS than the total day count for the month
                if startDate['startDateDay'] < monthrange(startDate['startDateYear'], startDate['startDateMonth'])[1]:
                    if startDate['startDateMonth'] >= 12:
                        startDate['startDateMonth'] = 1;
                        startDate['startDateYear'] += 1;
                else:
                    startDate['startDateDay'] = 1; # A new day!
                    startDate['startDateMonth'] += 1;
        currentTime = str(startDate['startTime']) + ":00 " + AMPM;
        startDate['startTime'] += 1;
        textlog.append('{}/{}/{}, {} - {}: {}'.format(startDate['startDateMonth'], startDate['startDateDay'], startDate['startDateYear'] - 2000, currentTime, textArr[0], textArr[1]));

    with open('output.txt', 'w') as file:  # Use file to refer to the file object
        for i in textlog:
            file.write(i);

getData();
