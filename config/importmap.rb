# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin "firebase/app", to: "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js"
pin "firebase/auth", to: "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js"
pin "firebase/firestore", to: "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js"
pin "env", to: "env.js"
pin "stimulus" # @3.2.2
pin "bootstrap", to: "https://ga.jspm.io/npm:bootstrap@5.2.3/dist/js/bootstrap.esm.js"
pin "@popperjs/core", to: "https://ga.jspm.io/npm:@popperjs/core@2.11.6/lib/index.js"
