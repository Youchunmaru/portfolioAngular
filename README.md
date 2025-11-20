# Portfolio

my portfolio website built with Angular and deployed locally with nginx and Cloudflare tunnel

## Development server

To start a local development server, run:

```bash
npm start
```

## Production build

```bash
npm prod
````
```bash
# needed for initial build and after changes of the nginx config
sudo nginx -t
sudo systemctl restart nginx
```
```nginx
location / {
    root /var/www/html; # Or wherever your angular files are
    index index.html;

    # 1. Try to find the specific file requested ($uri)
    # 2. Try to find a folder with that name ($uri/)
    # 3. If neither exists, serve index.html (Angular takes over!)
    try_files $uri $uri/ /index.html;
}
```

## Automation scripts

to publish to nginx run:
```bash
sudo ./publish.sh
```

to setup cloudflare tunnel run:
```bash
sudo ./setup-cloudflared.sh
```

## some pre-requisites you might need

```bash
sudo apt-get install nginx -y
```
```bash
# or use https://github.com/nvm-sh/nvm
sudo apt-get install npm
```
```bash
npm install -g @angular/cli
```
```bash
# Add Cloudflare's GPG key
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null

# Add the 'cloudflared' repository
echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared buster main' | sudo tee /etc/apt/sources.list.d/cloudflared.list

sudo apt install cloudflared
```
