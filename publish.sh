git update

sudo cp dist/portfolio/browser/* /var/www/html

sudo nginx -t
sudo systemctl restart nginx
