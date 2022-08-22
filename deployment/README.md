# Ansible troubleshooting

## Python 3 support

If using older Linux distributions (e.g. Ubuntu 18.04 including WSL) the default Ansible package could be configured
to use Python 2 (this can be verified using `ansible --version`).

This apparently causes issues when the target machine runs Ubuntu 20.04, see e.g.:
https://stackoverflow.com/questions/59716485/ansible-how-to-change-python-version

To fix that install newer Ansible version using PIP:
https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#installing-ansible-with-pip

Note that PIP will install Ansible to your user's home directory and you will probably need to re-login in order
for Ansible commands to appear on the PATH environment variable.

## Postgres role

Intake24 deployment scripts use the ANXS.postgres role to configure Postgres.

Run `ansible-galaxy install -r requirements.yml` to install it.
