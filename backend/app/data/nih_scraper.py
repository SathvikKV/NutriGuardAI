from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import os
import requests
import time

base_url = "https://ods.od.nih.gov/factsheets/list-all/"
output_dir = 'processed/nih'
os.makedirs(output_dir, exist_ok=True)

chrome_options = Options()
chrome_options.add_argument("--headless")

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=chrome_options)

print("Visiting Main List-All page...")
driver.get(base_url)

WebDriverWait(driver, 15).until(
    EC.presence_of_element_located((By.TAG_NAME, 'a'))
)

soup = BeautifulSoup(driver.page_source, 'html.parser')
links = [a for a in soup.find_all('a') if a.get('href', '').startswith('/factsheets/')]

print(f"Found {len(links)} supplement links")

count = 0

for link in links:
    name = link.text.strip().replace('/', '-')
    href = link['href']
    full_url = f"https://ods.od.nih.gov{href}"

    print(f"Scraping: {name}")

    # Re-open base page to avoid stale elements
    driver.get(base_url)
    WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.TAG_NAME, 'a'))
    )

    try:
        # Find the same link with Selenium
        element = driver.find_element(By.LINK_TEXT, name)
        element.click()

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, '.ui-dialog-content a'))
        )

        real_link = driver.find_element(By.CSS_SELECTOR, '.ui-dialog-content a').get_attribute('href')

        if not real_link:
            print(f"Skipping {name} - No link found")
            continue

        res = requests.get(real_link)
        content_soup = BeautifulSoup(res.text, 'html.parser')
        content = content_soup.select_one('.content')

        if content:
            text = content.get_text(separator='\n').strip()

            with open(os.path.join(output_dir, f"{name}.txt"), 'w', encoding='utf-8') as f:
                f.write(text)

            count += 1

    except Exception as e:
        print(f"Error while scraping {name}: {e}")

print(f"\nScraping Completed! Total Supplements scraped = {count}")
driver.quit()
