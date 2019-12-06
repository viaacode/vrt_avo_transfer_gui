PROJECT=viaa-tools
WD=/tmp
REPO_URI=https://github.com/viaacode/vrt_avo_transfer_gui.git
GIT_NAME=vrt_avo_transfer_gui
APP_NAME=VAT
TOKEN=`oc whoami -t`
path_to_oc=`which oc`
oc_registry=docker-registry-default.apps.do-prd-okp-m0.do.viaa.be

.ONESHELL:
SHELL = /bin/bash
.PHONY:	all
check-env:
OC_PROJECT=${PROJECT}
ifndef BRANCH
 # $(error BRANCH is undefined)
 BRANCH=master
endif
TAG=${ENV}

commit:
	git add .
	git commit -a
	git push
checkTools:
	if [ -x "${path_to_executable}" ]; then  echo "OC tools found here: ${path_to_executable}"; else echo please install the oc tools: https://github.com/openshiftorigin/releases/tag/v3.9.0; fi; uname && netstat | grep docker| grep -e CONNECTED  1> /dev/null || echo docker not running or not using linux
login:	check-env
	oc login do-prd-okp-m0.do.viaa.be:8443
	docker login -p "${TOKEN}" -u unused ${oc_registry}
	oc new-project "${OC_PROJECT}" || oc project "${OC_PROJECT}"
	sleep 4 && oc new-project "${OC_PROJECT}" || oc project "${OC_PROJECT}"
	oc adm policy add-scc-to-user anyuid -n${OC_PROJECT} -z default

clone:
	cd /tmp && git clone  --single-branch -b ${BRANCH} "${REPO_URI}" 
buildimage:
	cd /tmp/${GIT_NAME}
	docker build -t ${oc_registry}/${OC_PROJECT}/${APP_NAME}:${TAG} .

deploy:
	oc apply -f openshift/vat-tmpl-dc.yaml
	oc process -l APP=VAT -f openshift/vat-tmpl-dc.yaml 
	oc process -l APP=VAT -p ENV=${ENV} -f openshift/vat-tmpl-dc.yaml | oc apply -f -                          


clean:
	rm -rf /tmp/${GIT_NAME}
all:	clean commit clone login buildimage deploy clean
