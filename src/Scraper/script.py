import os
import time
import logging
import unidecode
from xml.dom import minidom
from datetime import datetime
from selenium import webdriver
import xml.etree.ElementTree as xt

def main():
    os.chdir("./src/Scraper")
    t = time.time()
    default_url = "https://www.worldwildlife.org"
    basic_info = []
    animals = []
    counter = 0
    logging.basicConfig(filename=f'log {str(datetime.now()).replace(":",".")}.log', format='%(asctime)s %(levelname)-8s %(message)s', level=logging.INFO, datefmt='%Y-%m-%d %H:%M:%S')
    print("Program Started")

    firefox_options = webdriver.FirefoxOptions()
    driver = webdriver.Firefox(options=firefox_options)
    driver.minimize_window()
    
    try:
        for i in range(1, 3, 1):
            print(f"Opening page number {i}")
            driver.get(f"{default_url}/species/directory?page={i}")
            tbody = driver.find_element_by_tag_name("tbody")
            print(f"Found the table")

            tr = tbody.find_elements_by_tag_name("tr")
            print("Created array with all rows")

            print("Starting to scrape basic information")
            for col in tr:
                first = True
                td = []
                for data in col.find_elements_by_tag_name("td"):
                    if first:
                        first = not first
                        td.append(data.find_element_by_tag_name("a").get_attribute('href'))
                    td.append(data.text)
                basic_info.append(td)
            print("Done scrapping basic information")
        qtd = len(basic_info)
        print("Starting to scrape complete information about the animals")

        for row in basic_info:
            photos_urls = []
            try:
                driver.get(row[0])
                content = driver.find_element_by_id("content")
                ul = content.find_elements_by_tag_name("ul")[1]
                ps = [content.find_elements_by_tag_name("p")[1], content.find_elements_by_tag_name("p")[2]]
                about = ul.find_elements_by_tag_name('li')
                photo_filter = "&filter=photos"

                Populacao, Altura, Peso, Tamanho, Habitats, Sobre, Localizacao = "","","","",[],"",[]

                try:
                    Populacao = str(f"{str(about[1].find_elements_by_tag_name('div')[0].text)}")
                except Exception as ex:
                    Populacao = "Unknown"
                    logging.warning(f"Error getting population at animal -> {row[0]}")
                    logging.warning(f"Error was -> {ex} ")

                try:
                    Altura = str(f"{str(about[3].find_elements_by_tag_name('div')[0].text)}")
                except Exception as ex:
                    Altura = "Unknown"
                    logging.warning(f"Error getting height at animal -> {row[0]}")
                    logging.warning(f"Error was -> {ex} ")

                try:
                    Peso = str(f"{str(about[4].find_elements_by_tag_name('div')[0].text)}")
                except Exception as ex:
                    Peso = "Unknown"
                    logging.warning(f"Error getting weight at animal -> {row[0]} ")
                    logging.warning(f"Error was -> {ex} ")

                try:
                    Tamanho = str(f"{str(about[5].find_elements_by_tag_name('div')[0].text)}")
                except Exception as ex:
                    Tamanho = "Unknown"
                    logging.warning(f"Error getting size at animal -> {row[0]} ")
                    logging.warning(f"Error was -> {ex} ")

                try:
                    Habitats = []
                    H = f"{str(about[6].find_elements_by_tag_name('div')[0].text)}".split(",")
                    for habitat in H:
                        Habitats.append(unidecode.unidecode(habitat))
                except Exception as ex:
                    Habitats = ["Unknown"]
                    logging.warning(f"Error getting habitats at animal -> {row[0]} ")
                    logging.warning(f"Error was -> {ex} ")

                try:
                    Sobre = f"{str(ps[0].text)} \n {str(ps[1].text)}"
                except Exception as ex:
                    Sobre = "Unknown"
                    logging.warning(f"Error getting information about at animal -> {row[0]} ")
                    logging.warning(f"Error was -> {ex} ")       

                try:
                    L = f"{content.find_elements_by_class_name('list-data')[1].find_elements_by_class_name('lead')[0].text}".split(",")
                    Localizacao = []
                    for local in L:
                        Localizacao.append(unidecode.unidecode(local))
                except Exception as ex:
                    Localizacao = ["Unknown"]
                    logging.warning(f"Error getting the location at animal -> {row[0]} ")
                    logging.warning(f"Error was -> {ex}")   
                try:
                    driver.get(str(content.find_elements_by_class_name("clearing")[0].find_elements_by_tag_name("a")[0].get_attribute("href")) + photo_filter)
                    uls = driver.find_element_by_id("content").find_elements_by_class_name("wrapper")[1].find_elements_by_tag_name("ul")

                    for li in uls:
                        for img in li.find_elements_by_tag_name("img"):
                            try:
                                photos_urls.append((str(img.get_attribute("src")).replace("featured_story", "story_full_width")))
                            except Exception as ex:
                                logging.warning(f"Error getting the photo at animal -> {row[0]} ")
                                logging.warning(f"Error was -> {ex}")
                except Exception as ex:
                    logging.warning(f"Error {ex}")

                obj = {
                    "Comum": f"{unidecode.unidecode(str(row[1]))}",
                    "Cientifico": f"{unidecode.unidecode(str(row[2]))}",
                    "Estado": f"{unidecode.unidecode(str(row[3]))}",
                    "Populacao": unidecode.unidecode(Populacao),
                    "Altura": unidecode.unidecode(Altura),
                    "Peso": unidecode.unidecode(Peso),
                    "Tamanho": unidecode.unidecode(Tamanho),
                    "Habitats": Habitats,
                    "Sobre": unidecode.unidecode(Sobre),
                    "Localizacao": Localizacao,
                    "Photos": photos_urls
                }

                animals.append(obj)
                counter += 1
                print(f"Added a new animal {counter} - {qtd} / {qtd - counter} to go")                
            except Exception as ex:
                print(f"Error {ex}")

        print(f"Took {str(time.time() - t)} seconds to scrape all the information")
        print("Appending to XML")
        xml(animals)
        driver.close()
        #os.remove("geckodriver.log")
    except Exception as ex:
        print(f"Error {ex}")

def xml(arr):
    animais = xt.Element("animais")
    id_counter = 0
    for obj in arr:
        animal = xt.Element("animal")

        animais.append(animal)

        animal_id = xt.SubElement(animal, "id")
        animal_id.text = str(id_counter)
        id_counter += 1

        comum = xt.SubElement(animal, "comum")
        comum.text = obj["Comum"]

        cientifico = xt.SubElement(animal, "cientifico")
        cientifico.text = obj["Cientifico"]

        estado = xt.SubElement(animal, "estado")
        estado.text = obj["Estado"]

        populacao = xt.SubElement(animal, "populacao")
        populacao.text = obj["Populacao"]

        altura = xt.SubElement(animal, "altura")
        altura.text = obj["Altura"]

        peso = xt.SubElement(animal, "peso")
        peso.text = obj["Peso"]

        tamanho = xt.SubElement(animal, "tamanho")
        tamanho.text = obj["Tamanho"]

        habitats = xt.Element("habitats")
        for hab in obj["Habitats"]:
            habitat = xt.SubElement(habitats, "habitat")
            habitat.text = hab
        animal.append(habitats)

        sobre = xt.SubElement(animal, "sobre")
        sobre.text = obj["Sobre"]

        localizacoes = xt.Element("localizacoes")
        for loc in obj["Localizacao"]:
            localizacao = xt.SubElement(localizacoes, "localizacao")
            localizacao.text = loc
        animal.append(localizacoes)

        fotos = xt.Element("photos")
        for photo in obj["Photos"]:
            foto = xt.SubElement(fotos, "photo")
            foto.text = photo
        animal.append(fotos)

    xmlstr = minidom.parseString(xt.tostring(animais)).toprettyxml(indent="    ")
    with open("data.xml", "a") as f:
        f.write(xmlstr)

if __name__ == "__main__":
    main()