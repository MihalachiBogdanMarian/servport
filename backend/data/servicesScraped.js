import servicesAutoAutoAddresses from "../../scraping/services-json-files/services-auto-auto-addresses.json";
import servicesAutoAuto from "../../scraping/services-json-files/services-auto-auto.json";
import servicesAutoTransportAddresses from "../../scraping/services-json-files/services-auto-transport-addresses.json";
import servicesAutoTransport from "../../scraping/services-json-files/services-auto-transport.json";
import servicesBuildersConstructionsAddresses from "../../scraping/services-json-files/services-builders-constructions-addresses.json";
import servicesBuildersConstructions from "../../scraping/services-json-files/services-builders-constructions.json";
import servicesBuildersInstallationsAddresses from "../../scraping/services-json-files/services-builders-installations-addresses.json";
import servicesBuildersInstallations from "../../scraping/services-json-files/services-builders-installations.json";
import servicesBuildersInteriorAddresses from "../../scraping/services-json-files/services-builders-interior-addresses.json";
import servicesBuildersInterior from "../../scraping/services-json-files/services-builders-interior.json";
import servicesBuildersRoofsAddresses from "../../scraping/services-json-files/services-builders-roofs-addresses.json";
import servicesBuildersRoofs from "../../scraping/services-json-files/services-builders-roofs.json";
import servicesCleaningAddresses from "../../scraping/services-json-files/services-cleaning-addresses.json";
import servicesCleaning from "../../scraping/services-json-files/services-cleaning.json";
import servicesEventsDecorationsAddresses from "../../scraping/services-json-files/services-events-decorations-addresses.json";
import servicesEventsDecorations from "../../scraping/services-json-files/services-events-decorations.json";
import servicesEventsPhotoAddresses from "../../scraping/services-json-files/services-events-photo-addresses.json";
import servicesEventsPhoto from "../../scraping/services-json-files/services-events-photo.json";
import servicesLessonsAddresses from "../../scraping/services-json-files/services-lessons-addresses.json";
import servicesLessons from "../../scraping/services-json-files/services-lessons.json";
import servicesRepairsAddresses from "../../scraping/services-json-files/services-repairs-addresses.json";
import servicesRepairs from "../../scraping/services-json-files/services-repairs.json";

const serviceDescriptions = [
    ...servicesRepairs,
    ...servicesBuildersInstallations,
    ...servicesBuildersConstructions,
    ...servicesBuildersRoofs,
    ...servicesBuildersInterior,
    ...servicesAutoAuto,
    ...servicesAutoTransport,
    ...servicesEventsPhoto,
    ...servicesEventsDecorations,
    ...servicesLessons,
    ...servicesCleaning,
];
const serviceAddresses = [
    ...servicesRepairsAddresses,
    ...servicesBuildersInstallationsAddresses,
    ...servicesBuildersConstructionsAddresses,
    ...servicesBuildersRoofsAddresses,
    ...servicesBuildersInteriorAddresses,
    ...servicesAutoAutoAddresses,
    ...servicesAutoTransportAddresses,
    ...servicesEventsPhotoAddresses,
    ...servicesEventsDecorationsAddresses,
    ...servicesLessonsAddresses,
    ...servicesCleaningAddresses,
];

export { serviceDescriptions, serviceAddresses };