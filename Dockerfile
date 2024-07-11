# Używamy obrazu Node.js jako bazowego
FROM node:14

# Ustawiamy katalog roboczy w kontenerze
WORKDIR /usr/src/app

# Kopiujemy plik package.json i package-lock.json do katalogu roboczego
COPY package*.json ./

# Instalujemy zależności
RUN npm install

# Kopiujemy resztę plików aplikacji do katalogu roboczego
COPY . .

# Kompilujemy kod TypeScript
RUN npx tsc

# Eksponujemy port, na którym będzie działać aplikacja
EXPOSE 6969

# Definiujemy polecenie startowe
CMD ["node", "dist/server.js"]
