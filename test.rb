#!/usr/bin/env ruby

tests = ['count-and-remove-all', 'edit-and-remove', 'history', 'storage']

# TODO check ko due to false dir is obvious
# TODO for use './test.rb fmk scenario' (scenario optional)

fmks = Hash.new
fmks['angularjs'] = 'architecture-examples/angularjs/index.html'
fmks['angularjs-perf'] = 'architecture-examples/angularjs-perf/index.html'
fmks['backbone'] = 'architecture-examples/backbone/index.html'
fmks['dart'] = 'architecture-examples/dart/web/index.html'
fmks['emberjs'] = 'architecture-examples/emberjs/index.html'
fmks['jquery'] = 'architecture-examples/jquery/index.html'
fmks['knockoutjs'] = 'architecture-examples/knockoutjs/index.html'
fmks['spine'] = 'architecture-examples/spine/index.html'
fmks['vanillajs'] = 'vanilla-examples/vanillajs/index.html'

def printok()
  print "\033[32m"
  printf '%-22s' % 'OK'
  print "\033[0m| "
end

def printko()
  print "\033[31m"
  printf '%-22s' % 'KO'
  print "\033[0m| "
end

printf '%-22s| ' % ' '

tests.each do |test|
  printf '%-22s| ' % test
end

print "\n"

#casperjs tests/$test.js ${fmks[$fmk]} &> /dev/null && printok || printko
fmks.keys.each do |key|
  printf '%21s | ' % key
  tests.each do |test|
    system("casperjs tests/#{test}.js #{fmks[key]} &> /dev/null") ? printok : printko
  end
  print "\n"
end
